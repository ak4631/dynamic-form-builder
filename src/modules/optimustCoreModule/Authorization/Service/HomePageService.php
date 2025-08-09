<?php

namespace Optimust\Core\Authorization\Service;

use Optimust\Core\Traits\UserRoleManagerTrait;

class HomePageService
{
    use UserRoleManagerTrait;

    /**
     * @return string|null
     */
    public function getHomePagePath(): ?string
    {
        return $this->getUserRoleManager()->getHomePage();
    }

    /**
     * @param string $module
     * @return string|null
     */
    public function getModuleDefaultPage(string $module): ?string
    {
        return $this->getUserRoleManager()->getModuleDefaultPage($module);
    }
}
