<?php

namespace Optimust\Admin\Dto;

use Optimust\Core\Dto\FilterParams;

class UserSearchFilterParams extends FilterParams
{
    public const ALLOWED_SORT_FIELDS = ['u.userName', 'u.status', 'r.name', 'r.displayName'];

    /**
     * @var bool|null
     */
    protected ?bool $status = null;
    /**
     * @var string|null
     */
    protected ?string $username = null;
    /**
     * @var int|null
     */
    protected ?int $userRoleId = null;
    /**
     * @var int|null
     */
    protected ?int $empNumber = null;
    /**
     * @var bool|null
     */
    protected ?bool $hasPassword = null;

    public function __construct()
    {
        $this->setSortField('u.userName');
    }

    /**
     * @return bool|null
     */
    public function getStatus(): ?bool
    {
        return $this->status;
    }

    /**
     * @param bool|null $status
     */
    public function setStatus(?bool $status): void
    {
        $this->status = $status;
    }

    /**
     * @return string|null
     */
    public function getUsername(): ?string
    {
        return $this->username;
    }

    /**
     * @param string|null $username
     */
    public function setUsername(?string $username): void
    {
        $this->username = $username;
    }

    /**
     * @return int|null
     */
    public function getUserRoleId(): ?int
    {
        return $this->userRoleId;
    }

    /**
     * @param int|null $userRoleId
     */
    public function setUserRoleId(?int $userRoleId): void
    {
        $this->userRoleId = $userRoleId;
    }

    /**
     * @return bool|null
     */
    public function hasPassword(): ?bool
    {
        return $this->hasPassword;
    }

    /**
     * @param bool|null $hasPassword
     */
    public function setHasPassword(?bool $hasPassword): void
    {
        $this->hasPassword = $hasPassword;
    }
}
