<?php

namespace Optimust\Authentication\Auth;

use Optimust\Authentication\Dto\AuthParamsInterface;
use Optimust\Authentication\Dto\UserCredentialInterface;
use Optimust\Authentication\Exception\AuthenticationException;
use Optimust\Authentication\Exception\PasswordEnforceException;
use Optimust\Authentication\Service\AuthenticationService;
use Optimust\Authentication\Traits\Service\PasswordStrengthServiceTrait;
use Optimust\Authentication\Utility\PasswordStrengthValidation;
use Optimust\Core\Service\ConfigService;
use Optimust\Core\Traits\Service\ConfigServiceTrait;
use Optimust\Framework\Services;

class LocalAuthProvider extends AbstractAuthProvider
{
    use ConfigServiceTrait;
    use PasswordStrengthServiceTrait;

    private AuthenticationService $authenticationService;

    /**
     * @return AuthenticationService
     */
    private function getAuthenticationService(): AuthenticationService
    {
        return $this->authenticationService ??= new AuthenticationService();
    }

    /**
     * @param AuthParamsInterface $authParams
     * @return bool
     * @throws AuthenticationException
     * @throws PasswordEnforceException
     */
    public function authenticate(AuthParamsInterface $authParams): bool
    {
        if (!$authParams->getCredential() instanceof UserCredentialInterface) {
            return false;
        }
        $success = $this->getAuthenticationService()->setCredentials($authParams->getCredential());
        if ($success) {
            if ($this->getConfigService()->getConfigDao()
                    ->getValue(ConfigService::KEY_ENFORCE_PASSWORD_STRENGTH) === 'on') {
                $passwordStrengthValidation = new PasswordStrengthValidation();
                $passwordStrength = $passwordStrengthValidation->checkPasswordStrength(
                    $authParams->getCredential()
                );

                if (!($this->getPasswordStrengthService()
                    ->isValidPassword($authParams->getCredential(), $passwordStrength))
                ) {
                    $e = new PasswordEnforceException(
                        AuthenticationException::PASSWORD_NOT_STRONG,
                        'Password is not strong',
                    );
                    $e->generateResetCode();

                    $session = $this->getContainer()->get(Services::SESSION);
                    $session->invalidate();
                    throw $e;
                }
            }
        }
        return $success;
    }

    /**
     * @inheritDoc
     */
    public function getPriority(): int
    {
        return 10000;
    }
}
