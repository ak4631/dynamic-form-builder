<?php

namespace Optimust\Core\Utility;

/**
 * A simple wrapper around the php password_hash and password_verify functions
 */
class PasswordHash
{
    public const ALGORITHM = PASSWORD_BCRYPT;

    // 2^12 iterations
    public const COST = 12;

    /**
     * Create password hash
     *
     * @param string $password Password
     * @return false|string|null
     */
    public function hash(string $password)
    {
        $options = [
            'cost' => self::COST
        ];
        return password_hash($password, PASSWORD_BCRYPT, $options);
    }

    /**
     * Verify password
     *
     * @param string $password Password
     * @param string $hash Hash
     * @return bool
     */
    public function verify(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }
}
