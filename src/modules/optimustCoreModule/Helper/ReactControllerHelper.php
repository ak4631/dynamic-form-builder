<?php

namespace Optimust\Core\Helper;

use Optimust\Admin\Traits\Service\UserServiceTrait;
use Optimust\Authentication\Auth\User;
use Optimust\Config\Config;
use Optimust\Core\Authorization\Service\ScreenPermissionService;
use Optimust\Core\Dto\AttributeBag;
use Optimust\Core\Exception\ServiceException;
use Optimust\Core\Traits\ModuleScreenHelperTrait;
use Optimust\Core\Traits\Service\MenuServiceTrait;
use Optimust\Core\React\Component;
use Optimust\Entity\MenuItem;
use Optimust\Entity\Module;
use Optimust\Framework\Http\Request;

class ReactControllerHelper
{
    use ModuleScreenHelperTrait;
    use UserServiceTrait;
    use MenuServiceTrait;

    public const COMPONENT_NAME = 'componentName';
    public const COMPONENT_PROPS = 'componentProps';
    public const PUBLIC_PATH = 'publicPath';
    public const BASE_URL = 'baseUrl';
    public const ASSETS_VERSION = 'assetsVersion';
    public const USER = 'user';
    public const SIDE_PANEL_MENU_ITEMS = 'sidePanelMenuItems';
    public const TOP_MENU_ITEMS = 'topMenuItems';
    public const CONTEXT_TITLE = 'contextTitle';
    public const CONTEXT_ICON = 'contextIcon';
    public const COPYRIGHT_YEAR = 'copyrightYear';
    public const PRODUCT_VERSION = 'productVersion';
    public const PRODUCT_NAME = 'productName';
    public const PERMISSIONS = 'permissions';
    public const BREADCRUMB = 'breadcrumb';
    public const DATE_FORMAT = 'dateFormat';
    public const CLIENT_LOGO_URL = 'clientLogoUrl';
    public const CLIENT_BANNER_URL = 'clientBannerUrl';
    public const THEME_VARIABLES = 'themeVariables';
    public const HELP_URL = 'helpUrl';

    /**
     * @var Request|null
     */
    protected ?Request $request = null;
    /**
     * @var null|Component
     */
    protected ?Component $component = null;
    /**
     * @var AttributeBag
     */
    protected AttributeBag $context;

    /**
     * @var ScreenPermissionService|null
     */
    protected ?ScreenPermissionService $screenPermissionService = null;

    public function __construct()
    {
        $this->context = new AttributeBag();
    }

    /**
     * @return Request|null
     */
    public function getRequest(): ?Request
    {
        return $this->request;
    }

    /**
     * @param Request|null $request
     */
    public function setRequest(?Request $request): void
    {
        $this->request = $request;
    }

    /**
     * @return Component|null
     */
    public function getComponent(): ?Component
    {
        return $this->component;
    }

    /**
     * @param Component|null $component
     */
    public function setComponent(?Component $component): void
    {
        $this->component = $component;
    }

    /**
     * @return array
     */
    public function getContextParams(): array
    {
        list($sidePanelMenuItems, $topMenuItems) = $this->getMenuItems();
        list($contextTitle, $contextIcon) = $this->getContextItems();
        list($clientLogoUrl, $clientBannerUrl, $themeVariables) = $this->getThemeData();

        $this->context->add(
            [
                self::COMPONENT_NAME => $this->getComponent()->getName(),
                self::COMPONENT_PROPS => $this->getComponent()->getProps(),
                self::PUBLIC_PATH => $this->getRequest()->getBasePath(),
                self::BASE_URL => $this->getRequest()->getBaseUrl(),
                self::ASSETS_VERSION => $this->getAssetsVersion(),
                self::USER => $this->getUserObject(),
                self::SIDE_PANEL_MENU_ITEMS => $sidePanelMenuItems,
                self::TOP_MENU_ITEMS => $topMenuItems,
                self::CONTEXT_TITLE => $contextTitle,
                self::CONTEXT_ICON => $contextIcon,
                self::COPYRIGHT_YEAR => date('Y'),
                self::PRODUCT_VERSION => Config::PRODUCT_VERSION,
                self::PRODUCT_NAME => Config::PRODUCT_NAME,
                self::BREADCRUMB => $this->getBreadcrumb(),
                self::DATE_FORMAT => 'Y-m-d',
                self::CLIENT_LOGO_URL => $clientLogoUrl,
                self::CLIENT_BANNER_URL => $clientBannerUrl,
                self::THEME_VARIABLES => $themeVariables,
                self::HELP_URL => $this->getHelpUrl(),
            ]
        );
        return $this->context->all();
    }

    /**
     * @return string
     */
    protected function getAssetsVersion(): string
    {
        return Config::get(Config::REACT_BUILD_TIMESTAMP);
    }

    /**
     * @return int|null
     */
    protected function getUserId(): ?int
    {
        return User::getInstance()->getUserId();
    }

    /**
     * @return array
     */
    protected function getUserObject(): array
    {
        if (is_null($this->getUserId())) {
            // No logged in user, may be in login page
            return [];
        }

        $user = $this->getUserService()->getSystemUser($this->getUserId());
        $profileImgUrl = '';
        
        $firstName = $user->getUserRole()->getDisplayName();
        $lastName = null;
        return [
            'firstName' => $firstName,
            'lastName' => $lastName,
            'profImgSrc' => $profileImgUrl,
            'hasPassword' => !is_null($user->getUserPassword()),
        ];
    }

    /**
     * @return array[]
     */
    protected function getMenuItems(): array
    {
        try {
            return $this->getMenuService()->getMenuItems($this->getRequest()->getBaseUrl());
        } catch (ServiceException $e) {
        }
        return [[], []];
    }

    /**
     * @return array|null[]
     */
    protected function getContextItems(): array
    {
        $currentScreen = $this->getScreenPermissionService()->getCurrentScreen();
        if ($currentScreen) {
            // TODO:: nav bar icon per screen
            return [$currentScreen->getName(), null];
        }
        return [null, null];
    }

    /**
     * @return ScreenPermissionService
     */
    public function getScreenPermissionService(): ScreenPermissionService
    {
        if (!$this->screenPermissionService instanceof ScreenPermissionService) {
            $this->screenPermissionService = new ScreenPermissionService();
        }
        return $this->screenPermissionService;
    }

    /**
     * @return array
     */
    public function getBreadcrumb(): array
    {
        $breadcrumb = [];
        $module = $this->getMenuService()
            ->getMenuDao()
            ->getModuleByName($this->getCurrentModuleAndScreen()->getModule());
        if ($module instanceof Module) {
            $breadcrumb['moduleName'] = $module->getDisplayName();
        }

        $menuItem = $this->getMenuService()->getMenuDao()->getMenuItemByModuleAndScreen(
            $this->getCurrentModuleAndScreen()->getModule(),
            $this->getCurrentModuleAndScreen()->getScreen()
        );
        if ($menuItem instanceof MenuItem) {
            $breadcrumb['level'] = $menuItem->getLevel() == 3 ? $menuItem->getParent()->getMenuTitle() : null;
            if (!is_null($breadcrumb['level'])) {
                $breadcrumb['level'] = $breadcrumb['level'];
            }
        }
        return $breadcrumb;
    }

    /**
     * @return string[]
     */
    private function getThemeData(): array
    {
        $clientLogoUrl = '';//$this->getThemeService()->getClientLogoURL($this->getRequest());
        $clientBannerUrl = '';//$this->getThemeService()->getClientBannerURL($this->getRequest());
        $themeVariables = [];//$this->getThemeService()->getCurrentThemeVariables();

        return [$clientLogoUrl, $clientBannerUrl, $themeVariables];
    }

    /**
     * @return string
     */
    private function getHelpUrl(): string
    {
        return $this->getRequest()->getBaseUrl()
            . '/help/help?label='
            . $this->getCurrentModuleAndScreen()->getModule() . '_'
            . $this->getCurrentModuleAndScreen()->getScreen();
    }
}
