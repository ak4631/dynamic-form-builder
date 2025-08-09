<?php

namespace Optimust\Core\PublicApi;

use Optimust\Config\Config;
use Optimust\Core\Api\CommonParams;
use Optimust\Core\Api\V1\Endpoint;
use Optimust\Core\Api\V1\EndpointResourceResult;
use Optimust\Core\Api\V1\EndpointResult;
use Optimust\Core\Api\V1\Model\ArrayModel;
use Optimust\Core\Api\V1\ResourceEndpoint;
use Optimust\Core\Api\V1\Validator\ParamRuleCollection;

class VersionAPI extends Endpoint implements ResourceEndpoint
{
    public const OPTIMUST_API_VERSION = 'version';

    /**
     * @inheritDoc
     */
    public function getOne(): EndpointResult
    {
        return new EndpointResourceResult(
            ArrayModel::class,
            [self::OPTIMUST_API_VERSION => Config::OPTIMUST_API_VERSION]
        );
    }

    /**
     * @inheritDoc
     */
    public function getValidationRuleForGetOne(): ParamRuleCollection
    {
        $paramRules = new ParamRuleCollection();
        $paramRules->addExcludedParamKey(CommonParams::PARAMETER_ID);
        return $paramRules;
    }

    /**
     * @inheritDoc
     */
    public function update(): EndpointResult
    {
        throw $this->getNotImplementedException();
    }

    /**
     * @inheritDoc
     */
    public function getValidationRuleForUpdate(): ParamRuleCollection
    {
        throw $this->getNotImplementedException();
    }

    /**
     * @inheritDoc
     */
    public function delete(): EndpointResult
    {
        throw $this->getNotImplementedException();
    }

    /**
     * @inheritDoc
     */
    public function getValidationRuleForDelete(): ParamRuleCollection
    {
        throw $this->getNotImplementedException();
    }
}
