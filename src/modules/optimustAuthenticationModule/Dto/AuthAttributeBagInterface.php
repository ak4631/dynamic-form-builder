<?php

namespace Optimust\Authentication\Dto;

interface AuthAttributeBagInterface
{
    /**
     * @return array
     */
    public function all(): array;

    /**
     * @return array
     */
    public function keys(): array;

    /**
     * @param array $parameters
     */
    public function replace(array $parameters = []): void;

    /**
     * @param array $parameters
     */
    public function add(array $parameters = []): void;

    /**
     * @param string $key
     * @param mixed|null $default
     * @return mixed
     */
    public function get(string $key, $default = null);

    /**
     * @param string $key
     * @param mixed $value
     */
    public function set(string $key, $value): void;

    /**
     * @param string $key
     * @return bool
     */
    public function has(string $key): bool;

    /**
     * @param string $key
     */
    public function remove(string $key): void;
}
