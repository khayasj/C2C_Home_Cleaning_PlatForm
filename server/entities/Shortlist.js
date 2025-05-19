const db = require('../db');

class Shortlist {
    async addToShortlist(homeownerusername, cleanerusername, cleaningservicename) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Lock the cleaningservice row first and check existence
            const [serviceDetails] = await connection.execute(
                'SELECT numofshortlist FROM cleaningservice WHERE cleanerusername = ? AND cleaningservicename = ? FOR UPDATE',
                [cleanerusername, cleaningservicename]
            );

            if (serviceDetails.length === 0) {
                await connection.rollback(); // Rollback if service doesn't exist
                return { success: false, message: 'Service not found' };
            }
            const currentShortlistCount = serviceDetails[0].numofshortlist;

            // 2. Check if entry already exists in the shortlist (locking the row/gap)
            const [existingCheck] = await connection.execute(
                'SELECT * FROM serviceshortlist WHERE homeownerusername = ? AND cleanerusername = ? AND cleaningservicename = ? FOR UPDATE',
                [homeownerusername, cleanerusername, cleaningservicename]
            );

            if (existingCheck.length > 0) {
                // Already in shortlist, commit and return current count
                await connection.commit();
                return {
                    success: true,
                    newShortlistCount: currentShortlistCount, // Return the count we already fetched
                    message: 'Already in shortlist'
                };
            }

            // 3. Add to shortlist (only keys)
            await connection.execute(
                'INSERT INTO serviceshortlist (homeownerusername, cleanerusername, cleaningservicename) VALUES (?, ?, ?)',
                [homeownerusername, cleanerusername, cleaningservicename]
            );

            // 4. Increment shortlist count in the authoritative cleaningservice table
            await connection.execute(
                'UPDATE cleaningservice SET numofshortlist = numofshortlist + 1 WHERE cleanerusername = ? AND cleaningservicename = ?',
                [cleanerusername, cleaningservicename]
            );

            await connection.commit();

            // Return the new count
            return { success: true, newShortlistCount: currentShortlistCount + 1 };

        } catch (err) {
            await connection.rollback();
            console.error('Error during addToShortlist transaction:', err);
            // Rethrow the error to be caught by the final catch block for consistent error reporting
            throw err;
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Error adding to shortlist:', err);
        // Specific handling for deadlock - suggest retry or inform user
        if (err.code === 'ER_LOCK_DEADLOCK') {
             return { success: false, message: 'Database deadlock occurred. Please try again.' };
        }
        // Generic error for other issues
        return { success: false, message: 'Database error occurred while adding to shortlist.' };
    }

    async removeFromShortlist(homeownerusername, cleanerusername, cleaningservicename) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Lock the cleaningservice row first to prevent race conditions on the count
            const [serviceDetails] = await connection.execute(
                'SELECT numofshortlist FROM cleaningservice WHERE cleanerusername = ? AND cleaningservicename = ? FOR UPDATE',
                [cleanerusername, cleaningservicename]
            );

            // If service doesn't exist, we can't remove it from a shortlist
            if (serviceDetails.length === 0) {
                await connection.rollback();
                return { success: false, message: 'Service not found' };
            }
            const currentShortlistCount = serviceDetails[0].numofshortlist;

            // 2. Check if the item is actually in the user's shortlist before attempting deletion
            const [existingCheck] = await connection.execute(
                'SELECT * FROM serviceshortlist WHERE homeownerusername = ? AND cleanerusername = ? AND cleaningservicename = ? FOR UPDATE',
                [homeownerusername, cleanerusername, cleaningservicename]
            );

            // If it's not in the shortlist, nothing to remove
            if (existingCheck.length === 0) {
                await connection.commit(); // Commit as no changes needed, but transaction started
                return {
                    success: true, // Or false depending on desired behavior for "not found"
                    newShortlistCount: currentShortlistCount,
                    message: 'Item not found in shortlist'
                };
            }

            // 3. Remove from shortlist
            const [deleteResult] = await connection.execute(
                'DELETE FROM serviceshortlist WHERE homeownerusername = ? AND cleanerusername = ? AND cleaningservicename = ?',
                [homeownerusername, cleanerusername, cleaningservicename]
            );

            // 4. Decrement shortlist count only if deletion was successful and count > 0
            if (deleteResult.affectedRows > 0 && currentShortlistCount > 0) {
                await connection.execute(
                    'UPDATE cleaningservice SET numofshortlist = numofshortlist - 1 WHERE cleanerusername = ? AND cleaningservicename = ?',
                    [cleanerusername, cleaningservicename]
                );
                 await connection.commit();
                 // Return the updated count
                 return { success: true, newShortlistCount: currentShortlistCount - 1 };
            } else {
                 // If deletion didn't happen or count was already 0, just commit
                 await connection.commit();
                 return { success: true, newShortlistCount: currentShortlistCount, message: 'Item removed or count already zero.' };
            }

        } catch (err) {
            await connection.rollback();
            console.error('Error during removeFromShortlist transaction:', err);
            // Specific handling for deadlock
            if (err.code === 'ER_LOCK_DEADLOCK') {
                 return { success: false, message: 'Database deadlock occurred. Please try again.' };
            }
            // Generic error for other issues
            return { success: false, message: 'Database error occurred while removing from shortlist.' };
        } finally {
            connection.release();
        }
    }
}

module.exports = new Shortlist ();