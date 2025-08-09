<?php

namespace Optimust\Authentication\Exception;

use Exception;

class AuthenticationException extends Exception
{
    public const USER_DISABLED = 'user_disabled';
    public const INVALID_CREDENTIALS = 'invalid_credentials';
    public const INVALID_CSRF_TOKEN = 'invalid_csrf_token';
    public const UNEXPECT_ERROR = 'unexpected_error';
    public const PASSWORD_NOT_STRONG = 'password_not_strong';
    public const INVALID_RESET_CODE = 'invalid_password_reset_code';

    /**
     * @var string
     */
    private string $name;

    /**
     * @param string $name
     * @param string $message
     */
    protected function __construct(string $name, string $message)
    {
        $this->name = $name;
        parent::__construct($message);
    }

    /**
     * @return array
     */
    public function normalize(): array
    {
        return [
            'error' => $this->name,
            'message' => $this->message,
        ];
    }

    /**
     * @return static
     */
    public static function userDisabled(): self
    {
        return new self(self::USER_DISABLED, 'Account disabled');
    }

    /**
     * @return static
     */
    public static function invalidCredentials(): self
    {
        return new self(self::INVALID_CREDENTIALS, 'Invalid credentials');
    }

    /**
     * @return static
     */
    public static function invalidCsrfToken(): self
    {
        return new self(self::INVALID_CSRF_TOKEN, 'CSRF token validation failed');
    }
}
