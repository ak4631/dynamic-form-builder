<?php

namespace Optimust\Core\Authorization\Dto;

use Optimust\Entity\UserRole;

class DataGroupPermissionFilterParams
{
    /**
     * @var UserRole[]
     */
    private array $userRoles = [];

    /**
     * @var bool
     */
    private bool $withApiDataGroups = false;

    /**
     * @var bool
     * Define to fetch only if, at least one permission there from read, create, update, delete
     */
    private bool $onlyAccessible = true;

    /**
     * @var string[]
     * e.g. ['ESS']
     */
    private array $rolesToExclude = [];

    /**
     * @var string[]
     * e.g. ['Admin', 'Supervisor']
     */
    private array $rolesToInclude = [];

    /**
     * @var array<string,int>
     * e.g. [User::class => 1]
     */
    private array $entities = [];

    /**
     * @var string[]
     * e.g. ['personal_information', 'contact_details']
     */
    private array $dataGroups = [];

    /**
     * @var bool
     */
    private bool $selfPermissions = false;

    /**
     * @return UserRole[]
     */
    public function getUserRoles(): array
    {
        return $this->userRoles;
    }

    /**
     * @param UserRole[] $userRoles
     */
    public function setUserRoles(array $userRoles): void
    {
        $this->userRoles = $userRoles;
    }

    /**
     * @return bool
     */
    public function isWithApiDataGroups(): bool
    {
        return $this->withApiDataGroups;
    }

    /**
     * @param bool $withApiDataGroups
     */
    public function setWithApiDataGroups(bool $withApiDataGroups): void
    {
        $this->withApiDataGroups = $withApiDataGroups;
    }

    /**
     * @return bool
     */
    public function isOnlyAccessible(): bool
    {
        return $this->onlyAccessible;
    }

    /**
     * @param bool $onlyAccessible
     */
    public function setOnlyAccessible(bool $onlyAccessible): void
    {
        $this->onlyAccessible = $onlyAccessible;
    }

    /**
     * @return string[]
     */
    public function getRolesToExclude(): array
    {
        return $this->rolesToExclude;
    }

    /**
     * @param string[] $rolesToExclude
     */
    public function setRolesToExclude(array $rolesToExclude): void
    {
        $this->rolesToExclude = $rolesToExclude;
    }

    /**
     * @return string[]
     */
    public function getRolesToInclude(): array
    {
        return $this->rolesToInclude;
    }

    /**
     * @param string[] $rolesToInclude
     */
    public function setRolesToInclude(array $rolesToInclude): void
    {
        $this->rolesToInclude = $rolesToInclude;
    }

    /**
     * @return int[]
     */
    public function getEntities(): array
    {
        return $this->entities;
    }

    /**
     * @param int[] $entities
     */
    public function setEntities(array $entities): void
    {
        $this->entities = $entities;
    }

    /**
     * @return string[]
     */
    public function getDataGroups(): array
    {
        return $this->dataGroups;
    }

    /**
     * @param string[] $dataGroups
     */
    public function setDataGroups(array $dataGroups): void
    {
        $this->dataGroups = $dataGroups;
    }

    /**
     * @return bool
     */
    public function isSelfPermissions(): bool
    {
        return $this->selfPermissions;
    }

    /**
     * @param bool $selfPermissions
     */
    public function setSelfPermissions(bool $selfPermissions): void
    {
        $this->selfPermissions = $selfPermissions;
    }
}
