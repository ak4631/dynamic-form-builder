<?php

namespace Optimust\Core\Controller;

use Optimust\Core\Authorization\Service\HomePageService;

abstract class AbstractModuleController extends AbstractController
{
    /**
     * @var HomePageService|null
     */
    protected ?HomePageService $homePageService = null;

    /**
     * @return HomePageService
     */
    public function getHomePageService(): HomePageService
    {
        if (!$this->homePageService instanceof HomePageService) {
            $this->homePageService = new HomePageService();
        }
        return $this->homePageService;
    }
}
