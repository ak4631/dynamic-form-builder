<?php

namespace Optimust\Authentication\Auth;

use Optimust\Authentication\Dto\AuthParamsInterface;
use Optimust\Authentication\Exception\AuthenticationException;

abstract class AbstractAuthProvider
{
    /**
     * @param AuthParamsInterface $authParams
     * @return bool
     * @throws AuthenticationException
     */
    abstract public function authenticate(AuthParamsInterface $authParams): bool;

    /**
     * @return int
     */
    abstract public function getPriority(): int;
}
