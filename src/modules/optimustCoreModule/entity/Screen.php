<?php

namespace Optimust\Entity;

use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Optimust\Entity\Module;
use Optimust\Entity\ScreenPermission;

#[ORM\Entity]
#[ORM\Table(name: 'screen')]
class Screen
{
    /**
     * @var int
     */
    #[ORM\Column(name: 'id', type: 'integer')]
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    private int $id;

    /**
     * @var string
     */
    #[ORM\Column(name: 'name', type: 'string', length: 100)]
    private string $name;

    /**
     * @var string
     */
    #[ORM\Column(name: 'action_url', type: 'string', length: 255)]
    private string $actionUrl;

    /**
     * @var Module
     */
    #[ORM\ManyToOne(targetEntity: Module::class)]
    #[ORM\JoinColumn(name: 'module_id', referencedColumnName: 'id')]
    private Module $module;

    /**
     * @var string|null
     */
    #[ORM\Column(name: 'menu_configurator', type: 'string', length: 255, nullable: true)]
    private ?string $menuConfigurator = null;

    /**
     * @var ScreenPermission[]|Collection
     */
    #[ORM\OneToMany(targetEntity: ScreenPermission::class, mappedBy: 'screen')]
    private $screenPermissions;

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
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getActionUrl(): string
    {
        return $this->actionUrl;
    }

    /**
     * @param string $actionUrl
     */
    public function setActionUrl(string $actionUrl): void
    {
        $this->actionUrl = $actionUrl;
    }

    /**
     * @return Module
     */
    public function getModule(): Module
    {
        return $this->module;
    }

    /**
     * @param Module $module
     */
    public function setModule(Module $module): void
    {
        $this->module = $module;
    }

    /**
     * @return string|null
     */
    public function getMenuConfigurator(): ?string
    {
        return $this->menuConfigurator;
    }

    /**
     * @param string|null $menuConfigurator
     */
    public function setMenuConfigurator(?string $menuConfigurator): void
    {
        $this->menuConfigurator = $menuConfigurator;
    }

    /**
     * @return Collection|ScreenPermission[]
     */
    public function getScreenPermissions()
    {
        return $this->screenPermissions;
    }

    /**
     * @param Collection|ScreenPermission[] $screenPermissions
     */
    public function setScreenPermissions($screenPermissions): void
    {
        $this->screenPermissions = $screenPermissions;
    }
}
