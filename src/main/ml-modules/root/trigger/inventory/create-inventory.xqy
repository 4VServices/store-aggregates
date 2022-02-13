xquery version "1.0-ml";

import module namespace trgr='http://marklogic.com/xdmp/triggers' 
  at '/MarkLogic/triggers.xqy';

declare variable $trgr:uri as xs:string external;
declare variable $trgr:trigger as node() external;

let $inventory := fn:doc($trgr:uri)
let $beer-name := $inventory/beer/fn:string()
let $beer-doc-uri := "/inventory/beer/" || $beer-name || ".json"
let $lock := xdmp:lock-for-update($beer-doc-uri)
let $_ := xdmp:log("trigger; uri=" || $trgr:uri)
let $_ := xdmp:log("trigger; beer-doc-uri=" || $beer-doc-uri)
return
  if (fn:doc-available($beer-doc-uri)) then
    let $existing-doc := fn:doc($beer-doc-uri)
    let $existing-total := $existing-doc/available/fn:data()
    let $updated-sources := 
      xdmp:from-json($existing-doc/sources)
      => map:with($trgr:uri, $inventory/available/fn:data())
    let $updated-total := fn:sum(map:keys($updated-sources) ! map:get($updated-sources, .))
    let $_ := xdmp:log("trigger; adding existing (" || $existing-total || ") and current (" || $updated-total || ")")
    return 
      xdmp:document-insert(
        $beer-doc-uri,
        object-node {
          "beer": $beer-name,
          "available": $updated-total,
          "sources": $updated-sources
        },
        map:entry("collections", ("inventory-beer"))
      )
  else
    let $_ := xdmp:log("trigger; new doc (" || $inventory/available/fn:data() || ")")
    return
    xdmp:document-insert(
      $beer-doc-uri,
      object-node {
        "beer": $beer-name,
        "available": $inventory/available/fn:data(),
        "sources": 
            json:object() 
            => map:with($trgr:uri, $inventory/available/fn:data()) 
      },
      map:entry("collections", ("inventory-beer"))
    )
