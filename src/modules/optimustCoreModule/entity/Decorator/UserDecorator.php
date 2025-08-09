<?php

namespace Optimust\Entity\Decorator;

use Optimust\Core\Traits\ORM\EntityManagerHelperTrait;
use Optimust\Entity\User;
use Optimust\Entity\UserRole;

class UserDecorator
{
    use EntityManagerHelperTrait;

    /**
     * @var User
     */
    private User $user;

    /**
     * @var string|null
     */
    private ?string $nonHashedPassword = null;

    /**
     * @param User $user
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * @return User
     */
    protected function getUser(): User
    {
        return $this->user;
    }

    /**
     * @param int $id
     */
    public function setUserRoleById(int $id): void
    {
        /** @var UserRole|null $userRole */
        $userRole = $this->getReference(UserRole::class, $id);
        $this->getUser()->setUserRole($userRole);
    }

    /**
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->getUser()->getUserRole()->getName() === 'Admin';
    }

    /**
     * @return string|null
     */
    public function getNonHashedPassword(): ?string
    {
        return $this->nonHashedPassword;
    }

    /**
     * @param string|null $nonHashedPassword
     */
    public function setNonHashedPassword(?string $nonHashedPassword): void
    {
        $this->nonHashedPassword = $nonHashedPassword;
    }
}
