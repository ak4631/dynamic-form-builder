<?php

namespace Optimust\Entity;

use Doctrine\ORM\Mapping as ORM;
use Optimust\Entity\Module;
use Optimust\Entity\DataGroup;

#[ORM\Entity]
#[ORM\Table(name: 'api_permission')]
#[ORM\UniqueConstraint(name: 'api_name', columns: ['api_name'])]
class ApiPermission
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
    #[ORM\Column(name: 'api_name', type: 'string', length: 255)]
    private string $apiName;

    /**
     * @var Module
     */
    #[ORM\ManyToOne(targetEntity: Module::class)]
    #[ORM\JoinColumn(name: 'module_id', referencedColumnName: 'id')]
    private Module $module;

    /**
     * @var DataGroup
     */
    #[ORM\ManyToOne(targetEntity: DataGroup::class, inversedBy: 'apiPermissions')]
    #[ORM\JoinColumn(name: 'data_group_id', referencedColumnName: 'id')]
    private DataGroup $dataGroup;

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
    public function getApiName(): string
    {
        return $this->apiName;
    }

    /**
     * @param string $apiName
     */
    public function setApiName(string $apiName): void
    {
        $this->apiName = $apiName;
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
     * @return DataGroup
     */
    public function getDataGroup(): DataGroup
    {
        return $this->dataGroup;
    }

    /**
     * @param DataGroup $dataGroup
     */
    public function setDataGroup(DataGroup $dataGroup): void
    {
        $this->dataGroup = $dataGroup;
    }
}
