<?php

namespace Optimust\Core\Authorization\UserRole;

use Optimust\Admin\Traits\Service\UserServiceTrait;
use Optimust\Core\Authorization\Manager\AbstractUserRoleManager;
use Optimust\Core\Authorization\Manager\BasicUserRoleManager;
use Optimust\Core\Traits\Auth\AuthUserTrait;

abstract class AbstractUserRole
{
    use AuthUserTrait;
    use UserServiceTrait;

    /**
     * @var AbstractUserRoleManager
     */
    protected AbstractUserRoleManager $userRoleManager;

    /**
     * @var string
     */
    protected string $roleName;

    /**
     * @param string $roleName
     * @param AbstractUserRoleManager $userRoleManager
     */
    final public function __construct(string $roleName, AbstractUserRoleManager $userRoleManager)
    {
        $this->userRoleManager = $userRoleManager;
        $this->roleName = $roleName;
    }

    /**
     * @param string $entityType
     * @param string|null $operation
     * @param null $returnType
     * @param array $requiredPermissions
     * @return int[]
     */
    public function getAccessibleEntityIds(
        string $entityType,
        ?string $operation = null,
        $returnType = null,
        array $requiredPermissions = []
    ): array {
        $permitted = $this->areRequiredPermissionsAvailable($requiredPermissions);
        $ids = [];
        if ($permitted) {
            $ids = $this->getAccessibleIdsForEntity($entityType, $requiredPermissions);
        }
        return $ids;
    }

    /**
     * @param string $entityType
     * @param array $requiredPermissions
     * @return int[]
     */
    abstract protected function getAccessibleIdsForEntity(
        string $entityType,
        array $requiredPermissions = []
    ): array;

    /**
     * @param array $requiredPermissions
     * @return bool
     */
    protected function areRequiredPermissionsAvailable(array $requiredPermissions = []): bool
    {
        $permitted = true;

        foreach ($requiredPermissions as $permissionType => $permissions) {
            if ($permissionType == BasicUserRoleManager::PERMISSION_TYPE_DATA_GROUP) {
                foreach ($permissions as $dataGroupName => $requestedResourcePermission) {
                    $dataGroupPermissions = $this->userRoleManager->getDataGroupPermissions(
                        $dataGroupName,
                        [],
                        [$this->roleName]
                    );

                    if ($permitted && $requestedResourcePermission->canRead()) {
                        $permitted = $permitted && $dataGroupPermissions->canRead();
                    }

                    if ($permitted && $requestedResourcePermission->canCreate()) {
                        $permitted = $dataGroupPermissions->canCreate();
                    }

                    if ($permitted && $requestedResourcePermission->canUpdate()) {
                        $permitted = $dataGroupPermissions->canUpdate();
                    }

                    if ($permitted && $requestedResourcePermission->canDelete()) {
                        $permitted = $dataGroupPermissions->canDelete();
                    }
                }
            } elseif ($permissionType == BasicUserRoleManager::PERMISSION_TYPE_ACTION) {
                $permitted = true;
            }
        }

        return $permitted;
    }

    /**
     * @param array $requiredPermissions
     * @return string[]
     */
    public function getAccessibleQuickLaunchList(array $requiredPermissions): array
    {
        return [];
    }
}
