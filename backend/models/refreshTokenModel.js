const {sql, poolPromise} = require('../config/configuration');

const refreshTokenModel = {
    // insert new refresh token into database
    createRefreshTokenModel: async (tokenData) => {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('accountID', sql.Int, tokenData.account_id)
            .input('tokenHash', sql.NVarChar, tokenData.token_hash)
            .input('jti', sql.NVarChar, tokenData.jti)
            .input('expiresAt', sql.DateTime, tokenData.expires_at)
            .query(`
                insert into RefreshTokens (account_id, token_hash, jti, expires_at, created_at)
                output inserted.*
                values (
                    @accountID,
                    @tokenHash,
                    @jti,
                    @expiresAt,
                    GETDATE()
                );
            `);
        return result.recordset[0];
    }
}

module.exports = refreshTokenModel;