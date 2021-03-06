/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { Field } from 'Util/Query';
import { ProductListQuery } from 'Query';
import { isSignedIn } from 'Util/Auth';

export class CartQuery {
    getCartQuery(quoteId) {
        const query = new Field('getCartForCustomer')
            .addFieldList(this._getCartTotalsFields())
            .setAlias('cartData');

        if (!isSignedIn()) {
            query.addArgument('guestCartId', 'String', quoteId);
        }

        return query;
    }

    getCreateEmptyCartMutation() {
        return new Field('createEmptyCart');
    }

    getSaveCartItemMutation(product, quoteId) {
        const mutation = new Field('saveCartItem')
            .addArgument('cartItem', 'CartItemInput!', product)
            .addFieldList(this._getSaveCartItemFields(quoteId));

        if (!isSignedIn()) {
            mutation.addArgument('guestCartId', 'String', quoteId);
        }

        return mutation;
    }

    getRemoveCartItemMutation(item_id, quoteId) {
        const mutation = new Field('removeCartItem')
            .addArgument('item_id', 'Int!', item_id)
            .addFieldList(this._getRemoveCartItemFields(quoteId));

        if (!isSignedIn()) {
            mutation.addArgument('guestCartId', 'String', quoteId);
        }

        return mutation;
    }

    getApplyCouponMutation(couponCode, quoteId) {
        const mutation = new Field('applyCoupon')
            .addArgument('coupon_code', 'String!', couponCode)
            .addField(this.getCartQuery(quoteId));

        if (!isSignedIn()) {
            mutation.addArgument('guestCartId', 'String', quoteId);
        }

        return mutation;
    }

    getRemoveCouponMutation(quoteId) {
        const mutation = new Field('removeCoupon')
            .addField(this.getCartQuery(quoteId));

        if (!isSignedIn()) {
            mutation.addArgument('guestCartId', 'String', quoteId);
        }

        return mutation;
    }

    _getSaveCartItemFields(quoteId) {
        return [
            this.getCartQuery(quoteId)
        ];
    }

    _getRemoveCartItemFields(quoteId) {
        return [
            this.getCartQuery(quoteId)
        ];
    }

    _getCartTotalsFields() {
        return [
            'subtotal',
            'subtotal_incl_tax',
            'items_qty',
            'tax_amount',
            'grand_total',
            'discount_amount',
            'quote_currency_code',
            'subtotal_with_discount',
            'coupon_code',
            'shipping_amount',
            'is_virtual',
            this._getCartItemsField()
        ];
    }

    _getCustomizableOptionPriceFields() {
        return [
            'value',
            'units',
            'type'
        ];
    }

    _getCustomizableOptionPriceField() {
        return new Field('price')
            .addFieldList(this._getCustomizableOptionPriceFields());
    }

    _getCustomizableOptionValueFields() {
        return [
            'id',
            'label',
            'value',
            this._getCustomizableOptionPriceField()
        ];
    }

    _getCustomizableOptionValueField() {
        return new Field('values')
            .addFieldList(this._getCustomizableOptionValueFields());
    }

    _getCustomizableOptionsFields() {
        return new Field('customizable_options')
            .addFieldList([
                'id',
                'label',
                'is_required',
                this._getCustomizableOptionValueField(),
                'sort_order'
            ]);
    }

    _getCartItemFields() {
        return [
            'qty',
            'sku',
            'price',
            'item_id',
            'row_total',
            'tax_amount',
            'tax_percent',
            'discount_amount',
            'discount_percent',
            this._getCustomizableOptionsFields(),
            this._getProductField()
        ];
    }

    _getProductField() {
        ProductListQuery.options.isForLinkedProducts = true;

        const productQuery = new Field('product')
            .addFieldList(ProductListQuery._getProductInterfaceFields(false, true));

        ProductListQuery.options.isForLinkedProducts = false;

        return productQuery;
    }

    _getCartItemsField() {
        return new Field('items')
            .addFieldList(this._getCartItemFields());
    }
}

export default new CartQuery();
