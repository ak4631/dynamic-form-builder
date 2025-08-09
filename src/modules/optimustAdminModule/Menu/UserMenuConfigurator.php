<?php

namespace Optimust\Admin\Menu;

use Optimust\Core\Menu\MenuConfigurator;
use Optimust\Core\Traits\ModuleScreenHelperTrait;
use Optimust\Entity\MenuItem;
use Optimust\Entity\Screen;

class UserMenuConfigurator implements MenuConfigurator
{
    use ModuleScreenHelperTrait;

    /**
     * @inheritDoc
     */
    public function configure(Screen $screen): ?MenuItem
    {
        $this->getCurrentModuleAndScreen()->overrideScreen('viewSystemUsers');
        return null;
    }
}
