<?php

namespace Optimust\Core\Helper;

class ClassHelper
{
    /**
     * @param string $className
     * @param string|null $fallbackNamespace
     * @return bool
     */
    public function classExists(string $className, ?string $fallbackNamespace = null): bool
    {
        return !is_null($this->getClass($className, $fallbackNamespace));
    }

    /**
     * @param string $className
     * @param string|null $fallbackNamespace e.g. 'Optimust\\Core\\', 'Optimust\\Core\\Service\\'
     * @return string|null
     */
    public function getClass(string $className, ?string $fallbackNamespace = null): ?string
    {
        if (class_exists($className)) {
            return $className;
        }
        if (!is_null($fallbackNamespace)) {
            $className = $fallbackNamespace . $className;
            if (class_exists($className)) {
                return $className;
            }
        }
        return null;
    }

    /**
     * @param string|object $classNameOrInstance
     * @param string ...$interfaces
     * @return bool
     */
    public function hasClassImplements($classNameOrInstance, string ...$interfaces): bool
    {
        $implementedInterfaces = class_implements($classNameOrInstance);
        $implementedInterfacesCount = count($implementedInterfaces);
        $interfacesCount = count($interfaces);
        if ($implementedInterfacesCount < $interfacesCount) {
            return false;
        }

        return $implementedInterfacesCount - $interfacesCount == count(array_diff($implementedInterfaces, $interfaces));
    }
}
