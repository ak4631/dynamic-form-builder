<?php

namespace Optimust\Entity\Decorator;

trait DecoratorTrait
{
    /**
     * @var object|null
     */
    protected ?object $entityDecorator = null;

    /**
     * @return object
     */
    public function getDecorator(): object
    {
        if (is_null($this->entityDecorator)) {
            $decoratorClassName = $this->getDecoratorClassName();
            $this->entityDecorator = new $decoratorClassName($this);
        }
        return $this->entityDecorator;
    }

    /**
     * @return string
     */
    protected function getDecoratorClassName(): string
    {
        return 'Optimust\\Entity\\Decorator\\' . substr(strrchr(get_class($this), '\\'), 1) . 'Decorator';
    }
}
