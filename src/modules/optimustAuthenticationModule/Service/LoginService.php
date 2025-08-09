<?php

namespace Optimust\Authentication\Service;

use Optimust\Admin\Traits\Service\UserServiceTrait;
use Optimust\Authentication\Dao\LoginLogDao;
use Optimust\Authentication\Dto\UserCredential;
use Optimust\Entity\LoginLog;

class LoginService
{
    use UserServiceTrait;

    /**
     * @var LoginLogDao|null
     */
    private ?LoginLogDao $loginLogDao = null;

    /**
     * @return LoginLogDao|null
     */
    public function getLoginLogDao(): ?LoginLogDao
    {
        if (!($this->loginLogDao instanceof LoginLogDao)) {
            $this->loginLogDao = new LoginLogDao();
        }
        return $this->loginLogDao;
    }

    /**
     * @param UserCredential $credentials
     * @return LoginLog
     */
    public function addLogin(UserCredential $credentials): LoginLog
    {
        $user = $this->getUserService()
            ->geUserDao()
            ->getUserByUserName($credentials->getUsername());
        $loginLog = new LoginLog();
        $loginLog->setUserId($user->getId());
        $loginLog->setUserName($user->getUserName());
        $loginLog->setUserRoleName($user->getUserRole()->getName());
        $loginLog->setUserRolePredefined($user->getUserRole()->isPredefined());
        return $this->getLoginLogDao()->saveLoginLog($loginLog);
    }
}
