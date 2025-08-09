<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

use Optimust\Authentication\Dto\UserCredential;
use Optimust\Authentication\Traits\Service\PasswordStrengthServiceTrait;
use Optimust\Authentication\Utility\PasswordStrengthValidation;
use Optimust\Core\Traits\Service\TextHelperTrait;

class Password extends AbstractRule
{
    use TextHelperTrait;
    use PasswordStrengthServiceTrait;

    private bool $changePassword;

    public function __construct(?bool $changePassword)
    {
        $this->changePassword = $changePassword ?? true;
    }

    public function validate($input): bool
    {
        if (!$this->changePassword) {
            return true;
        }

        $passwordStrengthValidation = new PasswordStrengthValidation();
        $credentials = new UserCredential(null, $input);

        $passwordStrength = $passwordStrengthValidation->checkPasswordStrength($credentials);
        $messages = $this->getPasswordStrengthService()->checkPasswordPolicies($credentials, $passwordStrength);

        if (count($messages) === 0) {
            return true;
        }
        return false;
    }
}
