<?php

namespace Optimust\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'unique_id')]
class UniqueId
{
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
    #[ORM\Column(name: 'last_id', type: 'integer', length: 10, options: ['unsigned' => true])]
    private int $lastId;

    /**
     * @var string
     */
    #[ORM\Column(name: 'table_name', type: 'string', length: 50)]
    private string $tableName;

    /**
     * @var string
     */
    #[ORM\Column(name: 'field_name', type: 'string', length: 50)]
    private string $fieldName;

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
     * @return int
     */
    public function getLastId(): int
    {
        return $this->lastId;
    }

    /**
     * @param int $lastId
     */
    public function setLastId(int $lastId): void
    {
        $this->lastId = $lastId;
    }

    /**
     * @return string
     */
    public function getTableName(): string
    {
        return $this->tableName;
    }

    /**
     * @param string $tableName
     */
    public function setTableName(string $tableName): void
    {
        $this->tableName = $tableName;
    }

    /**
     * @return string
     */
    public function getFieldName(): string
    {
        return $this->fieldName;
    }

    /**
     * @param string $fieldName
     */
    public function setFieldName(string $fieldName): void
    {
        $this->fieldName = $fieldName;
    }
}
