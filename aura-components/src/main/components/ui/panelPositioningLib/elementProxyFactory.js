/*
 * Copyright (C) 2013 salesforce.com, inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function lib(elementProxy, utils, win) { //eslint-disable-line no-unused-vars
    'use strict';
    var w = win || window; // window injected for testing    
    var ElementProxy = elementProxy.ElementProxy;    
    var proxyCache = {};
    var proxyCounter = 0;
    
    function releaseOrphanProxies () {
        for(var proxy in proxyCache) {
            if(!proxyCache[proxy].el.checkNodeIsInDom()) {
                proxyCache[proxy].el.release();
            }
        }
    }

    function bakeOff() {
        for(var proxy in proxyCache) {
            if(proxyCache[proxy].el.isDirty()) {
                proxyCache[proxy].el.bake();
            }
        }
    }

    
    function assignNodeKey(node) {
        var key = "aura-pos-lib-" + proxyCounter++;
        node.setAttribute("data-proxy-id", key);
        return key;
    }

    function getNodeKey(node) {
        return node && node.getAttribute("data-proxy-id");
    }

    function getReferenceCount(el) {
        var id = getNodeKey(el);
        if (!id || !proxyCache[id]) {
            return 0;
        } else {
            return proxyCache[id].refCount;
        }
    }

    function release(prx) {
        var proxy = proxyCache[prx.key];
        if(proxy) {
            --proxy.refCount;
        }
        if(proxy && proxy.refCount <= 0 ) {
            delete proxyCache[prx.key];
        }
        // if there is no proxy in the cache 
        // this is a no-op
    }
    
    function elementProxyFactory(el) {
        var key, newProxy, id;

        if(utils.isWindow(el)) {
            key = 'window';
        } else {
            // 1 - Node.ELEMENT_NODE, 11 - Node.DOCUMENT_FRAGMENT_NODE
            $A.assert(el && el.nodeType && (el.nodeType !== 1 || el.nodeType !== 11), "Element Proxy requires an element");

            key = getNodeKey(el);
            if (!key) {
                key = assignNodeKey(el);
            }

            if(!el.id) {
                var cmp = w.$A.getComponent(el);
                el.id = cmp ? cmp.getGlobalId() : "window";
            }
            id = el.id;
        }

        if(proxyCache[key]) {
            proxyCache[key].refCount++;
            return proxyCache[key].el;
        } else {
            newProxy = new ElementProxy(el, id);
            newProxy.key = key;
            newProxy.setReleaseCallback(release, newProxy);

            proxyCache[key] = {
                el: newProxy,
                refCount : 1
            };
        }

        // run GC
        w.setTimeout(releaseOrphanProxies, 0);
        return proxyCache[key].el;
    }

    function reset(){
        proxyCache = {};
    }

    return {
        _proxyCache: proxyCache,
        getReferenceCount: getReferenceCount,
        getElement : elementProxyFactory,
        bakeOff : bakeOff,
        resetFactory: reset,
        release: release
    };
}
