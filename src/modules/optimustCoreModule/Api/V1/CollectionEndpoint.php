<?php

namespace Optimust\Core\Api\V1;

use Optimust\Core\Api\V1\Exception\ForbiddenException;
use Optimust\Core\Api\V1\Exception\NotImplementedException;
use Optimust\Core\Api\V1\Exception\RecordNotFoundException;
use Optimust\Core\Api\V1\Serializer\NormalizeException;
use Optimust\Core\Api\V1\Validator\ParamRuleCollection;

interface CollectionEndpoint
{
    /**
     * Get collection of resources
     * @return EndpointResult
     * @throws NormalizeException
     * @throws NotImplementedException
     * @throws RecordNotFoundException
     * @throws ForbiddenException
     */
    public function getAll(): EndpointResult;

    /**
     * Validation rules for CollectionEndpoint::getAll
     * @return ParamRuleCollection
     * @throws NotImplementedException
     */
    public function getValidationRuleForGetAll(): ParamRuleCollection;

    /**
     * Create a new resource
     * @return EndpointResult
     * @throws NormalizeException
     * @throws NotImplementedException
     * @throws RecordNotFoundException
     * @throws ForbiddenException
     */
    public function create(): EndpointResult;

    /**
     * Validation rules for CollectionEndpoint::create
     * @return ParamRuleCollection
     * @throws NotImplementedException
     */
    public function getValidationRuleForCreate(): ParamRuleCollection;

    /**
     * Delete list of resources
     * @return EndpointResult
     * @throws NormalizeException
     * @throws NotImplementedException
     * @throws RecordNotFoundException
     * @throws ForbiddenException
     */
    public function delete(): EndpointResult;

    /**
     * Validation rules for CollectionEndpoint::delete
     * @return ParamRuleCollection
     * @throws NotImplementedException
     */
    public function getValidationRuleForDelete(): ParamRuleCollection;
}
