<?php

namespace Optimust\Core\Authorization\Service;

use Exception;
use Optimust\Admin\Traits\Service\UserServiceTrait;
use Optimust\Core\Authorization\Manager\AbstractUserRoleManager;
use Optimust\Core\Exception\DaoException;
use Optimust\Core\Exception\ServiceException;
use Optimust\Core\Traits\Auth\AuthUserTrait;
use Optimust\Core\Traits\ClassHelperTrait;
use Optimust\Core\Traits\LoggerTrait;
use Optimust\Core\Traits\Service\ConfigServiceTrait;
use Optimust\Entity\User;

class UserRoleManagerService
{
    use ClassHelperTrait;
    use ConfigServiceTrait;
    use AuthUserTrait;
    use LoggerTrait;
    use UserServiceTrait;

    public const KEY_USER_ROLE_MANAGER_CLASS = 'authorize_user_role_manager_class';

    /**
     * @return string|null
     * @throws DaoException
     */
    public function getUserRoleManagerClassName(): ?string
    {
        return $this->getConfigService()->getConfigDao()->getValue(self::KEY_USER_ROLE_MANAGER_CLASS);
    }

    /**
     * @return AbstractUserRoleManager|null
     * @throws DaoException
     * @throws ServiceException
     */
    public function getUserRoleManager(): ?AbstractUserRoleManager
    {
        $class = $this->getUserRoleManagerClassName();
        $manager = null;

        $fallbackNamespace = 'Optimust\\Core\\Authorization\\Manager\\';
        if ($this->getClassHelper()->classExists($class, $fallbackNamespace)) {
            try {
                $class = $this->getClassHelper()->getClass($class, $fallbackNamespace);
                $manager = new $class();
            } catch (Exception $e) {
                throw new ServiceException('Exception when initializing user role manager:' . $e->getMessage());
            }
        } else {
            throw new ServiceException(sprintf('User Role Manager class %s not found.', $class));
        }

        if (!$manager instanceof AbstractUserRoleManager) {
            throw new ServiceException(
                sprintf('User Role Manager class %s is not a subclass of %s', $class, AbstractUserRoleManager::class)
            );
        }

        // Set System User object in manager
        $userId = $this->getAuthUser()->getUserId();
        if (is_null($userId)) {
            throw new ServiceException('No logged in user found.');
        }
        $systemUser = $this->getUserService()->getSystemUser($userId);

        if ($systemUser instanceof User) {
            $manager->setUser($systemUser);
        } else {
            $this->getLogger()->info('No logged in system user when creating UserRoleManager');
        }

        return $manager;
    }
}
