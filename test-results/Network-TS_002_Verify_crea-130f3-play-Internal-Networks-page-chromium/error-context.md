# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e6]:
    - heading "This site can’t be reached" [level=1] [ref=e7]:
      - generic [ref=e8]: This site can’t be reached
    - paragraph [ref=e9]:
      - strong [ref=e10]: dev.multiportal.io
      - text: took too long to respond.
    - generic [ref=e11]:
      - paragraph [ref=e12]: "Try:"
      - list [ref=e13]:
        - listitem [ref=e14]: Checking the connection
        - listitem [ref=e15]:
          - link "Checking the proxy and the firewall" [ref=e16] [cursor=pointer]:
            - /url: "#buttons"
        - listitem [ref=e17]:
          - link "Running Windows Network Diagnostics" [ref=e18] [cursor=pointer]:
            - /url: javascript:diagnoseErrors()
    - generic [ref=e19]: ERR_CONNECTION_TIMED_OUT
  - generic [ref=e20]:
    - button "Reload" [ref=e22] [cursor=pointer]
    - button "Details" [ref=e23] [cursor=pointer]
```