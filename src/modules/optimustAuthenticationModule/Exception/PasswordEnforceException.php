<?php

namespace Optimust\Authentication\Exception;

use Optimust\Authentication\Traits\Service\PasswordStrengthServiceTrait;
use Optimust\Core\Exception\RedirectableException;

class PasswordEnforceException extends AuthenticationException implements RedirectableException
{
    use PasswordStrengthServiceTrait;

    private string $resetCode;

    public function __construct(string $name, string $message)
    {
        parent::__construct($name, $message);
    }

    public function generateResetCode(): void
    {
        $this->resetCode = $this->getPasswordStrengthService()->logPasswordEnforceRequest();
    }

    public function getRedirectUrl(): string
    {
        return 'changeWeakPassword/resetCode/' . $this->resetCode;
    }
}
