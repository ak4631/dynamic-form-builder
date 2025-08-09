<?php

namespace Optimust\Authentication\Dao;

use Optimust\Core\Dao\BaseDao;
use Optimust\Entity\LoginLog;

class LoginLogDao extends BaseDao
{
    /**
     * @param LoginLog $loginLog
     * @return LoginLog
     */
    public function saveLoginLog(LoginLog $loginLog): LoginLog
    {
        $this->persist($loginLog);
        return $loginLog;
    }
}
