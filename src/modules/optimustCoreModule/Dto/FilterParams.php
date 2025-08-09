<?php

namespace Optimust\Core\Dto;

use Optimust\Core\Exception\SearchParamException;
use Optimust\ORM\ListSorter;

class FilterParams
{
    public const DEFAULT_LIMIT = 50;
    public const DEFAULT_OFFSET = 0;

    private string $sortOrder = ListSorter::ASCENDING;
    private ?string $sortField = null;
    private int $limit = self::DEFAULT_LIMIT;
    private int $offset = self::DEFAULT_OFFSET;

    /**
     * @return string
     */
    public function getSortOrder(): string
    {
        return $this->sortOrder;
    }

    /**
     * @param string $sortOrder
     * @throws SearchParamException
     */
    public function setSortOrder(string $sortOrder): void
    {
        if (!in_array($sortOrder, [ListSorter::ASCENDING, ListSorter::DESCENDING])) {
            throw new SearchParamException(
                sprintf(
                    '$sortOrder should be %s or %s, received %s',
                    ListSorter::ASCENDING,
                    ListSorter::DESCENDING,
                    $sortOrder
                )
            );
        }
        $this->sortOrder = $sortOrder;
    }

    /**
     * @return string|null
     */
    public function getSortField(): ?string
    {
        return $this->sortField;
    }

    /**
     * @param string|null $sortField
     */
    public function setSortField(?string $sortField): void
    {
        $this->sortField = $sortField;
    }

    /**
     * @return int
     */
    public function getLimit(): int
    {
        return $this->limit;
    }

    /**
     * @param int $limit
     */
    public function setLimit(int $limit): void
    {
        $this->limit = $limit;
    }

    /**
     * @return int
     */
    public function getOffset(): int
    {
        return $this->offset;
    }

    /**
     * @param int $offset
     */
    public function setOffset(int $offset): void
    {
        $this->offset = $offset;
    }
}
