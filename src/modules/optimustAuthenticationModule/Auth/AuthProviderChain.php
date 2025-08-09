<?php

namespace Optimust\Authentication\Auth;

use InvalidArgumentException;
use Optimust\Authentication\Dto\AuthParamsInterface;

class AuthProviderChain
{
    /**
     * @var AbstractAuthProvider[]
     */
    private array $providers = [];

    /**
     * @var string[]
     */
    private array $providerClasses = [];

    /**
     * @var int[]
     */
    private array $priorities = [];

    /**
     * @param AbstractAuthProvider $authProvider
     */
    public function addProvider(AbstractAuthProvider $authProvider): void
    {
        $providerClass = get_class($authProvider);
        if (in_array($providerClass, $this->providerClasses)) {
            throw new InvalidArgumentException("Instance of `$providerClass` already register as auth provider");
        }
        if (in_array($authProvider->getPriority(), $this->priorities)) {
            throw new InvalidArgumentException(
                "Conflicting priority value of `$providerClass` with another auth provider"
            );
        }
        $this->providers[] = $authProvider;
        $this->priorities[] = $authProvider->getPriority();
        $this->providerClasses[] = $providerClass;
    }

    /**
     * @param AuthParamsInterface $authParams
     * @return bool
     */
    public function authenticate(AuthParamsInterface $authParams): bool
    {
        array_multisort($this->priorities, SORT_DESC, $this->providers);
        foreach ($this->providers as $authProvider) {
            if ($authProvider->authenticate($authParams)) {
                return true;
            }
        }
        return false;
    }
}
