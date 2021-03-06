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
package org.auraframework.impl.java.controller;

import org.auraframework.annotations.Annotations.ServiceComponent;
import org.auraframework.ds.servicecomponent.Controller;
import org.auraframework.system.Annotations.AuraEnabled;
import org.auraframework.system.Annotations.Key;

@ServiceComponent
public class TestControllerWithParameters implements Controller {

    @AuraEnabled
    public String appendStrings(@Key("a") String a, @Key("b") String b) {
        return a + b;
    }

    @AuraEnabled
    public Integer sumValues(@Key("a") Integer a, @Key("b") Integer b) {
        return Integer.valueOf(a.intValue() + b.intValue());
    }

    @AuraEnabled
    public String customParam(@Key("a") CustomParam a) {
        return "Anything";
    }

    public class CustomParam {
    }
}
