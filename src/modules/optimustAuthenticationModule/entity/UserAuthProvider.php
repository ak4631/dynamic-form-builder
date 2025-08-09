<?php

namespace Optimust\Entity;

use Doctrine\ORM\Mapping as ORM;
use Optimust\Entity\User;

#[ORM\Entity]
#[ORM\Table(name: 'user_auth_provider')]
class UserAuthProvider
{
    public const TYPE_LOCAL = 1;
    public const TYPE_LDAP = 2;

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
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'authProviders')]
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id')]
    private User $user;

    /**
     * @var int
     */
    #[ORM\Column(name: 'provider_type', type: 'integer')]
    private int $type;

    /**
     * @var string|null
     */
    #[ORM\Column(name: 'ldap_user_hash', type: 'string', length: 255, nullable: true)]
    private ?string $ldapUserHash = null;

    /**
     * @var string|null
     */
    #[ORM\Column(name: 'ldap_user_dn', type: 'string', length: 255, nullable: true)]
    private ?string $ldapUserDN = null;

    /**
     * @var string|null
     */
    #[ORM\Column(name: 'ldap_user_unique_id', type: 'string', length: 255, nullable: true)]
    private ?string $ldapUserUniqueId = null;

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
     * @return int
     */
    public function getType(): int
    {
        return $this->type;
    }

    /**
     * @param int $type
     */
    public function setType(int $type): void
    {
        $this->type = $type;
    }

    /**
     * @return string|null
     */
    public function getLDAPUserHash(): ?string
    {
        return $this->ldapUserHash;
    }

    /**
     * @param string|null $ldapUserHash
     */
    public function setLDAPUserHash(?string $ldapUserHash): void
    {
        $this->ldapUserHash = $ldapUserHash;
    }

    /**
     * @return string|null
     */
    public function getLDAPUserDN(): ?string
    {
        return $this->ldapUserDN;
    }

    /**
     * @param string|null $ldapUserDN
     */
    public function setLDAPUserDN(?string $ldapUserDN): void
    {
        $this->ldapUserDN = $ldapUserDN;
    }

    /**
     * @return string|null
     */
    public function getLDAPUserUniqueId(): ?string
    {
        return $this->ldapUserUniqueId;
    }

    /**
     * @param string|null $ldapUserUniqueId
     */
    public function setLDAPUserUniqueId(?string $ldapUserUniqueId): void
    {
        $this->ldapUserUniqueId = $ldapUserUniqueId;
    }
}
