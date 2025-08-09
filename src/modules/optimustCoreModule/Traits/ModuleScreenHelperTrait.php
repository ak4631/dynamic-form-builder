<?php

namespace Optimust\Core\Traits;

use Optimust\Core\Dto\ModuleScreen;
use Optimust\Core\Helper\ModuleScreenHelper;

trait ModuleScreenHelperTrait
{
    /**
     * @return ModuleScreen
     */
    protected function getCurrentModuleAndScreen(): ModuleScreen
    {
        return ModuleScreenHelper::getCurrentModuleAndScreen();
    }
}
