<?php

namespace Optimust\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'group_field')]
class GroupField
{
    /**
     * @var int
     */
    #[ORM\Column(name: 'group_field_id', type: 'integer')]
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'NONE')]
    private int $id;

    /**
     * @var string
     */
    #[ORM\Column(name: 'name', type: 'string', length: 255)]
    private string $name;

    /**
     * @var string
     */
    #[ORM\Column(name: 'group_by_clause', type: 'text')]
    private string $groupByClause;

    /**
     * @var string|null
     */
    #[ORM\Column(name: 'group_field_widget', type: 'string', length: 255, nullable: true)]
    private ?string $groupFieldWidget = null;

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
    public function getGroupByClause(): string
    {
        return $this->groupByClause;
    }

    /**
     * @param string $groupByClause
     */
    public function setGroupByClause(string $groupByClause): void
    {
        $this->groupByClause = $groupByClause;
    }

    /**
     * @return string|null
     */
    public function getGroupFieldWidget(): ?string
    {
        return $this->groupFieldWidget;
    }

    /**
     * @param string|null $groupFieldWidget
     */
    public function setGroupFieldWidget(?string $groupFieldWidget): void
    {
        $this->groupFieldWidget = $groupFieldWidget;
    }
}
