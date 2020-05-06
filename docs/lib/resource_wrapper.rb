def build_resource(resource_name)
  ResourceWrapper.wrap(resource_name)
end

class ResourceWrapper < OpenStruct
  def self.wrap(resource_name)
    raw = I18n.backend.send(:translations)[I18n.locale][resource_name.to_sym]
    ResourceWrapper.new(raw).tap { |wrapper| wrapper._resource_name = resource_name }
  end

  def available?
    !gecko.key?(:unavailable)
  end

  def child_resource
    return unless child
    self.class.wrap(child)
  end

  def attributes_for_create
    attributes.select { |k,v| v[:creatable] && !v[:private] }
  end

  def extra_table_for_create?
    create_extra_table&.fetch(:enable, false)
  end
end
