<?php

namespace Optimust\Core\Traits\Service;

use Optimust\Core\Service\MenuService;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Services;

trait MenuServiceTrait
{
    use ServiceContainerTrait;

    /**
     * @return MenuService
     */
    public function getMenuService(): MenuService
    {
        return $this->getContainer()->get(Services::MENU_SERVICE);
    }
}
