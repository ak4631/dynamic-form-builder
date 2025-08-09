<?php

namespace Optimust\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'enforce_password')]
class EnforcePasswordRequest
{
    /**
     * @var int
     */
    #[ORM\Column(name: 'id', type: 'integer')]
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    private int $id;

    /**
     * @var User
     */
    #[ORM\ManyToOne(targetEntity: \Optimust\Entity\User::class)]
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id')]
    private User $user;

    /**
     * @var DateTime
     */
    #[ORM\Column(name: 'enforce_request_date', type: 'datetime')]
    private DateTime $resetRequestDate;

    /**
     * @var string
     */
    #[ORM\Column(name: 'reset_code', type: 'string', length: 200)]
    private string $resetCode;

    /**
     * @var bool
     */
    #[ORM\Column(name: 'expired', type: 'boolean')]
    private bool $expired = false;

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId(int $id): void
    {
        $this->id = $id;
    }

    /**
     * @return User
     */
    public function getUser(): User
    {
        return $this->user;
    }

    /**
     * @param User $user
     */
    public function setUser(User $user): void
    {
        $this->user = $user;
    }

    /**
     * @return DateTime
     */
    public function getResetRequestDate(): DateTime
    {
        return $this->resetRequestDate;
    }

    /**
     * @param DateTime $resetRequestDate
     */
    public function setResetRequestDate(DateTime $resetRequestDate): void
    {
        $this->resetRequestDate = $resetRequestDate;
    }

    /**
     * @return string
     */
    public function getResetCode(): string
    {
        return $this->resetCode;
    }

    /**
     * @param string $resetCode
     */
    public function setResetCode(string $resetCode): void
    {
        $this->resetCode = $resetCode;
    }

    /**
     * @return bool
     */
    public function isExpired(): bool
    {
        return $this->expired;
    }

    /**
     * @param bool $expired
     */
    public function setExpired(bool $expired): void
    {
        $this->expired = $expired;
    }
}
