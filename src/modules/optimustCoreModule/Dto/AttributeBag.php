<?php


namespace Optimust\Core\Dto;

use ArrayIterator;
use Countable;
use IteratorAggregate;

class AttributeBag implements IteratorAggregate, Countable
{
    /**
     * @var array
     */
    protected array $parameters = [];

    /**
     * @param array $parameters
     */
    public function __construct(array $parameters = [])
    {
        $this->parameters = $parameters;
    }

    /**
     * @return array
     */
    public function all(): array
    {
        return $this->parameters;
    }

    /**
     * @return array
     */
    public function keys(): array
    {
        return array_keys($this->parameters);
    }

    /**
     * @param array $parameters
     */
    public function replace(array $parameters = []): void
    {
        $this->parameters = $parameters;
    }

    /**
     * @param array $parameters
     */
    public function add(array $parameters = []): void
    {
        $this->parameters = array_replace($this->parameters, $parameters);
    }

    /**
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function get(string $key, $default = null)
    {
        return array_key_exists($key, $this->parameters) ? $this->parameters[$key] : $default;
    }

    /**
     * @param string $key
     * @param mixed $value
     */
    public function set(string $key, $value): void
    {
        $this->parameters[$key] = $value;
    }

    /**
     * @param string $key
     * @return bool
     */
    public function has(string $key): bool
    {
        return array_key_exists($key, $this->parameters);
    }

    /**
     * @param string $key
     */
    public function remove(string $key): void
    {
        unset($this->parameters[$key]);
    }

    /**
     * @return ArrayIterator
     */
    public function getIterator(): ArrayIterator
    {
        return new ArrayIterator($this->parameters);
    }

    /**
     * @return int
     */
    public function count(): int
    {
        return count($this->parameters);
    }
}
