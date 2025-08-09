<?php

namespace Optimust\Admin\Service;

use Optimust\Admin\Dao\UserDao;
use Optimust\Admin\Dto\UserSearchFilterParams;
use Optimust\Authentication\Dto\UserCredential;
use Optimust\Config\Config;
use Optimust\Core\Traits\UserRoleManagerTrait;
use Optimust\Core\Utility\PasswordHash;
use Optimust\Entity\User;
use Optimust\Entity\UserRole;

class UserService
{
    use UserRoleManagerTrait;

    public const USERNAME_MIN_LENGTH = 5;
    public const USERNAME_MAX_LENGTH = 40;

    private UserDao $userDao;
    private PasswordHash $passwordHasher;

    /**
     * @return UserDao
     */
    public function geUserDao(): UserDao
    {
        return $this->userDao ??= new UserDao();
    }

    /**
     * @param UserDao $userDao
     */
    public function setUserDao(UserDao $userDao): void
    {
        $this->userDao = $userDao;
    }

    /**
     * @return PasswordHash
     */
    public function getPasswordHasher(): PasswordHash
    {
        return $this->passwordHasher ??= new PasswordHash();
    }

    /**
     * @param PasswordHash $passwordHasher
     */
    public function setPasswordHasher(PasswordHash $passwordHasher): void
    {
        $this->passwordHasher = $passwordHasher;
    }

    /**
     * @param User $user
     * @return User|null
     */
    public function saveSystemUser(User $user): ?User
    {
        if ((Config::PRODUCT_MODE === Config::MODE_DEMO && is_null($user->getCreatedBy()))) {
            return $user;
        }
        if (!is_null($user->getDecorator()->getNonHashedPassword())) {
            $user->setUserPassword($this->hashPassword($user->getDecorator()->getNonHashedPassword()));
            $user->getDecorator()->setNonHashedPassword(null);
        }

        return $this->geUserDao()->saveSystemUser($user);
    }

    /**
     * Get System User for given User Id
     * @param int $userId
     * @return User|null
     */
    public function getSystemUser(int $userId): ?User
    {
        return $this->geUserDao()->getSystemUser($userId);
    }

    /**
     * Soft Delete System Users
     * @param array $deletedIds
     * @return int
     */
    public function deleteSystemUsers(array $deletedIds): int
    {
        return $this->geUserDao()->deleteSystemUsers($deletedIds);
    }

    /**
     * Get User role with given name
     * @param string $roleName
     * @return UserRole|null
     */
    public function getUserRole(string $roleName): ?UserRole
    {
        return $this->geUserDao()->getUserRole($roleName);
    }

    /**
     * @param UserSearchFilterParams $userSearchParamHolder
     * @return int
     */
    public function getSearchSystemUsersCount(UserSearchFilterParams $userSearchParamHolder): int
    {
        return $this->geUserDao()->getSearchSystemUsersCount($userSearchParamHolder);
    }

    /**
     * @param UserSearchFilterParams $userSearchParamHolder
     * @return User[]
     */
    public function searchSystemUsers(UserSearchFilterParams $userSearchParamHolder): array
    {
        return $this->geUserDao()->searchSystemUsers($userSearchParamHolder);
    }

    /**
     * @param int $userId
     * @param string $password
     * @return bool
     */
    public function isCurrentPassword(int $userId, string $password): bool
    {
        $user = $this->geUserDao()->getSystemUser($userId);

        if (!$user instanceof User || $user->getUserPassword() === null) {
            return false;
        }

        $hash = $user->getUserPassword();
        if ($this->checkPasswordHash($password, $hash)) {
            return true;
        } elseif ($this->checkForOldHash($password, $hash)) {
            return true;
        }

        return false;
    }

    /**
     * @param UserCredential $credentials
     * @return User|null
     */
    public function getCredentials(UserCredential $credentials): ?User
    {
        $user = $this->geUserDao()->isExistingSystemUser($credentials);
        if ($user instanceof User) {
            $hash = $user->getUserPassword();
            if ($this->checkPasswordHash($credentials->getPassword(), $hash)) {
                return $user;
            } elseif ($this->checkForOldHash($credentials->getPassword(), $hash)) {
                // password matches, but in old format. Need to update hash
                $user->getDecorator()->setNonHashedPassword($credentials->getPassword());
                return $this->saveSystemUser($user);
            }
        }

        return null;
    }

    /**
     * Hash password for storage
     * @param string $password
     * @return string hashed password
     */
    private function hashPassword(string $password): string
    {
        return $this->getPasswordHasher()->hash($password);
    }

    /**
     * Checks if the password hash matches the password.
     * @param string $password
     * @param string $hash
     * @return bool
     */
    private function checkPasswordHash(string $password, string $hash): bool
    {
        return $this->getPasswordHasher()->verify($password, $hash);
    }

    /**
     * Check if password matches hash for hashes stored using older hash methods.
     *
     * @param string $password
     * @param string $hash
     * @return bool
     */
    private function checkForOldHash(string $password, string $hash): bool
    {
        return $hash == md5($password);
    }

    /**
     * @return int[]
     */
    public function getUndeletableUserIds(): array
    {
        $undeletableIds = [];
        $user = $this->getUserRoleManager()->getUser();
        if ($user instanceof User) {
            $undeletableIds[] = $user->getId();
        }
        if (Config::PRODUCT_MODE === Config::MODE_DEMO &&
            ($defaultAdminUser = $this->geUserDao()->getDefaultAdminUser()) instanceof User) {
            $undeletableIds[] = $defaultAdminUser->getId();
        }

        return $undeletableIds;
    }
}
