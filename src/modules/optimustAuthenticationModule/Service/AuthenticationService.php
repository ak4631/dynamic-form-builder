<?php

namespace Optimust\Authentication\Service;

use Optimust\Admin\Traits\Service\UserServiceTrait;
use Optimust\Authentication\Dto\UserCredential;
use Optimust\Authentication\Exception\AuthenticationException;
use Optimust\Core\Traits\Auth\AuthUserTrait;
use Optimust\Entity\User;

class AuthenticationService
{
    use AuthUserTrait;
    use UserServiceTrait;

    /**
     * @param User|null $user
     * @return bool
     * @throws AuthenticationException
     */
    public function setCredentialsForUser(?User $user): bool
    {
        if (!$user instanceof User || $user->isDeleted()) {
            return false;
        } else {
            if (!$user->getStatus()) {
                throw AuthenticationException::userDisabled();
            }

            $this->setUserAttributes($user);
            return true;
        }
    }

    /**
     * @param UserCredential $credentials
     * @return bool
     * @throws AuthenticationException
     */
    public function setCredentials(UserCredential $credentials): bool
    {
        $user = $this->getUserService()->getCredentials($credentials);
        return $this->setCredentialsForUser($user);
    }

    /**
     * @param User $user
     */
    protected function setUserAttributes(User $user): void
    {
        $this->getAuthUser()->setUserId($user->getId());
        $this->getAuthUser()->setUserRoleId($user->getUserRole()->getId());
        $this->getAuthUser()->setUserRoleName($user->getUserRole()->getName());
    }
}
