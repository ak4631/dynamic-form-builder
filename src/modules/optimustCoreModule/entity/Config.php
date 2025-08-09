<?php

namespace Optimust\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Config
 */
#[ORM\Entity]
#[ORM\Table(name: 'config')]
class Config
{
    /**
     * @var string
     */
    #[ORM\Column(name: 'name', type: 'string', length: 100)]
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'NONE')]
    private string $name;

    /**
     * @var string
     */
    #[ORM\Column(name: 'value', type: 'text')]
    private string $value;

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
    public function getValue(): string
    {
        return $this->value;
    }

    /**
     * @param string $value
     */
    public function setValue(string $value): void
    {
        $this->value = $value;
    }
}
