<?php

namespace Optimust\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * EmailConfiguration
 *
 * @ORM\Table("email_configuration")
 * @ORM\Entity
 * @ORM\EntityListeners({"Optimust\Entity\Listener\EmailConfigurationListener"})
 */
class EmailConfiguration
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private int $id;


    /**
     * @var string|null
     *
     * @ORM\Column(name="mail_type", type="string", length=50, nullable=true)
     */
    private ?string $mailType = null;

    /**
     * @var string
     *
     * @ORM\Column(name="sent_as", type="string", length=250, nullable=false)
     */
    private string $sentAs;

    /**
     * @var string|null
     *
     * @ORM\Column(name="smtp_host", type="string", length=250, nullable=true)
     */
    private ?string $smtpHost = null;

    /**
     * @var int|null
     *
     * @ORM\Column(name="smtp_port", type="integer", length=10, nullable=true)
     */
    private ?int $smtpPort = null;

    /**
     * @var string|null
     *
     * @ORM\Column(name="smtp_username", type="string", length=250, nullable=true)
     */
    private ?string $smtpUsername = null;

    /**
     * @var string|null
     *
     * @ORM\Column(name="smtp_password", type="string", length=250, nullable=true)
     */
    private ?string $smtpPassword = null;

    /**
     * @var string|null
     *
     * @ORM\Column(name="smtp_auth_type", type="string", length=50, nullable=true)
     */
    private ?string $smtpAuthType = null;

    /**
     * @var string|null
     *
     * @ORM\Column(name="smtp_security_type", type="string", length=50, nullable=true)
     */
    private ?string $smtpSecurityType = null;

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
     * @return string|null
     */
    public function getMailType(): ?string
    {
        return $this->mailType;
    }

    /**
     * @param string|null $mailType
     */
    public function setMailType(?string $mailType): void
    {
        $this->mailType = $mailType;
    }

    /**
     * @return string
     */
    public function getSentAs(): string
    {
        return $this->sentAs;
    }

    /**
     * @param string $sentAs
     */
    public function setSentAs(string $sentAs): void
    {
        $this->sentAs = $sentAs;
    }

    /**
     * @return string|null
     */
    public function getSmtpHost(): ?string
    {
        return $this->smtpHost;
    }

    /**
     * @param string|null $smtpHost
     */
    public function setSmtpHost(?string $smtpHost): void
    {
        $this->smtpHost = $smtpHost;
    }

    /**
     * @return int|null
     */
    public function getSmtpPort(): ?int
    {
        return $this->smtpPort;
    }

    /**
     * @param int|null $smtpPort
     */
    public function setSmtpPort(?int $smtpPort): void
    {
        $this->smtpPort = $smtpPort;
    }

    /**
     * @return string|null
     */
    public function getSmtpUsername(): ?string
    {
        return $this->smtpUsername;
    }

    /**
     * @param string|null $smtpUsername
     */
    public function setSmtpUsername(?string $smtpUsername): void
    {
        $this->smtpUsername = $smtpUsername;
    }

    /**
     * @return string|null
     */
    public function getSmtpPassword(): ?string
    {
        return $this->smtpPassword;
    }

    /**
     * @param string|null $smtpPassword
     */
    public function setSmtpPassword(?string $smtpPassword): void
    {
        $this->smtpPassword = $smtpPassword;
    }

    /**
     * @return string|null
     */
    public function getSmtpAuthType(): ?string
    {
        return $this->smtpAuthType;
    }

    /**
     * @param string|null $smtpAuthType
     */
    public function setSmtpAuthType(?string $smtpAuthType): void
    {
        $this->smtpAuthType = $smtpAuthType;
    }

    /**
     * @return string|null
     */
    public function getSmtpSecurityType(): ?string
    {
        return $this->smtpSecurityType;
    }

    /**
     * @param string|null $smtpSecurityType
     */
    public function setSmtpSecurityType(?string $smtpSecurityType): void
    {
        $this->smtpSecurityType = $smtpSecurityType;
    }
}
