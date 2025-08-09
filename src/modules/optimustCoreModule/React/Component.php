<?php

namespace Optimust\Core\React;

class Component
{
    /**
     * @var string
     */
    public string $name;
    /**
     * @var array
     */
    public array $props = [];

    /**
     * @param string $name
     * @param Prop[] $props
     */
    public function __construct(string $name, array $props = [])
    {
        $this->name = $name;
        $this->props = $props;
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
     * @return Prop[]
     */
    public function getProps(): array
    {
        return $this->props;
    }

    /**
     * @param Prop[] $props
     */
    public function setProps(array $props): void
    {
        $this->props = $props;
    }

    /**
     * @param Prop $prop
     */
    public function addProp(Prop $prop): void
    {
        $this->props = array_merge($this->props, [$prop]);
    }
}
