<?php

namespace Optimust\ORM\NestedSet;

interface NestedSetInterface
{
    /**
     * @return int|null
     */
    public function getLft(): ?int;

    /**
     * @param int|null $lft
     */
    public function setLft(?int $lft): void;

    /**
     * @return int|null
     */
    public function getRgt(): ?int;

    /**
     * @param int|null $rgt
     */
    public function setRgt(?int $rgt): void;

    /**
     * @return int|null
     */
    public function getLevel(): ?int;

    /**
     * @param int|null $level
     */
    public function setLevel(?int $level): void;

    /**
     * @return NodeInterface
     */
    public function getNode(): NodeInterface;

    /**
     * @param NodeInterface|null $node
     */
    public function setNode(?NodeInterface $node): void;
}
