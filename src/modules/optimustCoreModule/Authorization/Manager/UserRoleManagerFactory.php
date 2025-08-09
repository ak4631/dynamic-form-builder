<?php

namespace Optimust\Core\Authorization\Manager;

use Optimust\Core\Authorization\Service\UserRoleManagerService;
use Optimust\Core\Exception\DaoException;
use Optimust\Core\Exception\ServiceException;

/**
 * Provides access to configured user role manager class.
 *
 */
class UserRoleManagerFactory
{
    /**
     * @var null|AbstractUserRoleManager
     */
    private static ?AbstractUserRoleManager $userRoleManager = null;

    /**
     * @return AbstractUserRoleManager
     * @throws ServiceException|DaoException
     */
    public static function getUserRoleManager(): AbstractUserRoleManager
    {
        if (!self::$userRoleManager instanceof AbstractUserRoleManager) {
            $userRoleManagerService = new UserRoleManagerService();
            self::$userRoleManager = $userRoleManagerService->getUserRoleManager();
        }
        return self::$userRoleManager;
    }

    /**
     * Get new user role manager when session detail changes
     *
     * @return AbstractUserRoleManager
     * @throws ServiceException|DaoException
     */
    public static function getNewUserRoleManager(): AbstractUserRoleManager
    {
        $userRoleManagerService = new UserRoleManagerService();
        return $userRoleManagerService->getUserRoleManager();
    }

    /**
     * Update current user role manager when session detail changes
     * @return AbstractUserRoleManager
     * @throws ServiceException|DaoException
     */
    public static function updateUserRoleManager(): AbstractUserRoleManager
    {
        self::$userRoleManager = self::getNewUserRoleManager();
        return self::$userRoleManager;
    }
}
