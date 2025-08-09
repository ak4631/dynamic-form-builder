<?php

namespace Optimust\Core\Authorization\Service;

use Optimust\Core\Authorization\Dao\ScreenDao;
use Optimust\Core\Authorization\Dao\ScreenPermissionDao;
use Optimust\Core\Authorization\Dto\ResourcePermission;
use Optimust\Core\Dto\ModuleScreen;
use Optimust\Core\Exception\DaoException;
use Optimust\Core\Helper\ModuleScreenHelper;
use Optimust\Entity\Screen;
use Optimust\Entity\UserRole;

class ScreenPermissionService
{
    /**
     * @var ScreenPermissionDao|null
     */
    private ?ScreenPermissionDao $screenPermissionDao = null;

    /**
     * @var ScreenDao|null
     */
    private ?ScreenDao $screenDao = null;

    /**
     * @return ScreenDao
     */
    public function getScreenDao(): ScreenDao
    {
        if (!$this->screenDao instanceof ScreenDao) {
            $this->screenDao = new ScreenDao();
        }
        return $this->screenDao;
    }

    /**
     * @param ScreenDao $screenDao
     */
    public function setScreenDao(ScreenDao $screenDao): void
    {
        $this->screenDao = $screenDao;
    }

    /**
     * @return ScreenPermissionDao
     */
    public function getScreenPermissionDao(): ScreenPermissionDao
    {
        if (!$this->screenPermissionDao instanceof ScreenPermissionDao) {
            $this->screenPermissionDao = new ScreenPermissionDao();
        }
        return $this->screenPermissionDao;
    }

    /**
     * @param ScreenPermissionDao $screenPermissionDao
     */
    public function setScreenPermissionDao(ScreenPermissionDao $screenPermissionDao): void
    {
        $this->screenPermissionDao = $screenPermissionDao;
    }

    /**
     * Get Screen Permissions for given module, action for the given roles
     * @param string $module Module Name
     * @param string $actionUrl Action Name
     * @param string[]|UserRole[] $roles Array of Role names or Array of UserRole objects
     * @return ResourcePermission
     * @throws DaoException
     */
    public function getScreenPermissions(string $module, string $actionUrl, array $roles): ResourcePermission
    {
        $screenPermissions = $this->getScreenPermissionDao()->getScreenPermissions($module, $actionUrl, $roles);

        // if empty, give all permissions
        if (count($screenPermissions) == 0) {
            // If screen not defined, give all permissions, if screen is defined,
            // but don't give any permissions.
            $screen = $this->getScreenDao()->getScreen($module, $actionUrl);
            if (is_null($screen)) {
                $permission = new ResourcePermission(true, true, true, true);
            } else {
                $permission = new ResourcePermission(false, false, false, false);
            }
        } else {
            $read = false;
            $create = false;
            $update = false;
            $delete = false;

            foreach ($screenPermissions as $screenPermission) {
                if ($screenPermission->canRead()) {
                    $read = true;
                }
                if ($screenPermission->canCreate()) {
                    $create = true;
                }
                if ($screenPermission->canUpdate()) {
                    $update = true;
                }
                if ($screenPermission->canDelete()) {
                    $delete = true;
                }
            }

            $permission = new ResourcePermission($read, $create, $update, $delete);
        }

        return $permission;
    }

    /**
     * @param string $module
     * @param string $actionUrl
     * @return Screen|null
     * @throws DaoException
     */
    public function getScreen(string $module, string $actionUrl): ?Screen
    {
        return $this->getScreenDao()->getScreen($module, $actionUrl);
    }

    /**
     * @return ModuleScreen
     */
    private function getCurrentModuleAndScreen(): ModuleScreen
    {
        return ModuleScreenHelper::getCurrentModuleAndScreen();
    }

    /**
     * @return Screen|null
     * @throws DaoException
     */
    public function getCurrentScreen(): ?Screen
    {
        $currentModuleAndScreen = $this->getCurrentModuleAndScreen();
        return $this->getScreen($currentModuleAndScreen->getModule(), $currentModuleAndScreen->getScreen());
    }
}
