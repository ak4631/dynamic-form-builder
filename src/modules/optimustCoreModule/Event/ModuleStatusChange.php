<?php

namespace Optimust\Core\Event;

use Optimust\Entity\Module;
use Optimust\Framework\Event\Event;

class ModuleStatusChange extends Event
{
    /**
     * @var Module
     */
    private Module $previousModule;

    /**
     * @var Module
     */
    private Module $currentModule;

    /**
     * @param Module $previousModule
     * @param Module $currentModule
     */
    public function __construct(Module $previousModule, Module $currentModule)
    {
        $this->previousModule = $previousModule;
        $this->currentModule = $currentModule;
    }

    /**
     * @return Module
     */
    public function getPreviousModule(): Module
    {
        return $this->previousModule;
    }

    /**
     * @return Module
     */
    public function getCurrentModule(): Module
    {
        return $this->currentModule;
    }
}
