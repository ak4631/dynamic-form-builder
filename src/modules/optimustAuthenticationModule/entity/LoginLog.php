<?php

namespace Optimust\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use Optimust\Core\Traits\Service\DateTimeHelperTrait;

#[ORM\Entity]
#[ORM\Table(name: 'login')]
class LoginLog
{
    use DateTimeHelperTrait;

    /**
     * @var int
     */
    #[ORM\Column(name: 'id', type: 'integer')]
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    private int $id;

    /**
     * @var int
     */
    #[ORM\Column(name: 'user_id', type: 'integer')]
    private int $userId;

    /**
     * @var string
     */
    #[ORM\Column(name: 'user_name', type: 'string', length: 255, nullable: true)]
    private string $userName;

    /**
     * @var string
     */
    #[ORM\Column(name: 'user_role_name', type: 'string', length: 100)]
    private string $userRoleName;

    /**
     * @var int
     */
    #[ORM\Column(name: 'user_role_predefined', type: 'integer')]
    private int $userRolePredefined;

    /**
     * @var DateTime
     */
    #[ORM\Column(name: 'login_time', type: 'datetime')]
    private DateTime $loginTime;

    public function __construct()
    {
        $this->setLoginTime($this->getDateTimeHelper()->getNow());
    }

    /**
     * @return int
     */
    public function getUserId(): int
    {
        return $this->userId;
    }

    /**
     * @param int $userId
     */
    public function setUserId(int $userId): void
    {
        $this->userId = $userId;
    }

    /**
     * @return string
     */
    public function getUserName(): string
    {
        return $this->userName;
    }

    /**
     * @param string $userName
     */
    public function setUserName(string $userName): void
    {
        $this->userName = $userName;
    }

    /**
     * @return string
     */
    public function getUserRoleName(): string
    {
        return $this->userRoleName;
    }

    /**
     * @param string $userRoleName
     */
    public function setUserRoleName(string $userRoleName): void
    {
        $this->userRoleName = $userRoleName;
    }

    /**
     * @return int
     */
    public function getUserRolePredefined(): int
    {
        return $this->userRolePredefined;
    }

    /**
     * @param int $userRolePredefined
     */
    public function setUserRolePredefined(int $userRolePredefined): void
    {
        $this->userRolePredefined = $userRolePredefined;
    }

    /**
     * @return DateTime
     */
    public function getLoginTime(): DateTime
    {
        return $this->loginTime;
    }

    /**
     * @param DateTime $loginTime
     */
    public function setLoginTime(DateTime $loginTime): void
    {
        $this->loginTime = $loginTime;
    }
}
