<?php

namespace Optimust\ORM\NestedSet;

interface NodeInterface
{
    /**
     * @return bool
     */
    public function hasChildren(): bool;

    /**
     * @return NestedSetInterface[]
     */
    public function getChildren(int $depth = 1): array;

    /**
     * @return bool
     */
    public function hasParent(): bool;

    /**
     * @return NestedSetInterface|null
     */
    public function getParent(): ?NestedSetInterface;

    /**
     * @return int
     */
    public function getLevel(): int;

    /**
     * @param NestedSetInterface $parent
     */
    public function insertAsLastChildOf(NestedSetInterface $parent): void;

    /**
     * @param NestedSetInterface $child
     */
    public function addChild(NestedSetInterface $child): void;

    /**
     * @return bool
     */
    public function isLeaf(): bool;

    /**
     * @return bool
     */
    public function isRoot(): bool;

    /**
     * Deletes node and it's descendants
     */
    public function delete();
}
