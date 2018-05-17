require 'redmine'

Redmine::Plugin.register :workflow_graph do
  name 'Redmine Workflow Graph plugin'
  author 'Hiroshi Chiyama'
  description 'interactive visualization of workflow definition'
  version '0.0.1'
  url 'https://github.com/chiyama/workflow_graph'
  author_url 'http://philosy.com/blog'
end
